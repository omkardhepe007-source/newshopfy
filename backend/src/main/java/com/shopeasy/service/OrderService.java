package com.shopeasy.service;

import com.shopeasy.dto.OrderDTO;
import com.shopeasy.entity.*;
import com.shopeasy.exception.ResourceNotFoundException;
import com.shopeasy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * OrderService - Handles order placement and order history retrieval.
 *
 * Place Order flow:
 *  1. Load user's cart — throw if empty
 *  2. Check stock for all items
 *  3. Create Order with snapshot of items (productName, price at that moment)
 *  4. Deduct stock from each product
 *  5. Clear the cart
 *
 * The stock deduction and cart clear happen in one @Transactional block,
 * so if anything fails, the whole operation is rolled back.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final CartRepository cartRepository;

    @Transactional
    public OrderDTO.OrderResponse placeOrder(String userEmail, OrderDTO.PlaceOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Cart cart = cartService.getOrCreateCart(user);

        if (cart.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cannot place an order with an empty cart.");
        }

        // Validate stock for all items first
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStock() < cartItem.getQuantity()) {
                throw new IllegalArgumentException(
                        "Insufficient stock for product: " + product.getName() +
                        ". Available: " + product.getStock());
            }
        }

        // Create order
        Order order = Order.builder()
                .user(user)
                .totalAmount(cart.getTotalPrice())
                .shippingAddress(request.getShippingAddress() != null
                        ? request.getShippingAddress()
                        : user.getAddress())
                .build();

        // Create order items (snapshot)
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> {
                    Product product = cartItem.getProduct();

                    // Deduct stock
                    product.setStock(product.getStock() - cartItem.getQuantity());
                    productRepository.save(product);

                    return OrderItem.builder()
                            .order(order)
                            .product(product)
                            .productName(product.getName())
                            .productPrice(product.getPrice())
                            .quantity(cartItem.getQuantity())
                            .build();
                })
                .collect(Collectors.toList());

        order.setOrderItems(orderItems);
        Order savedOrder = orderRepository.save(order);

        // Clear the cart after successful order
        cartService.clearCart(cart);

        return mapToOrderResponse(savedOrder);
    }

    public List<OrderDTO.OrderResponse> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderDTO.OrderResponse getOrderById(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Order does not belong to this user.");
        }

        return mapToOrderResponse(order);
    }

    // Admin: update order status
    @Transactional
    public OrderDTO.OrderResponse updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
        return mapToOrderResponse(orderRepository.save(order));
    }

    // Admin: get all orders
    public List<OrderDTO.OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    // ========== MAPPER ==========

    private OrderDTO.OrderResponse mapToOrderResponse(Order order) {
        List<OrderDTO.OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> {
                    OrderDTO.OrderItemResponse r = new OrderDTO.OrderItemResponse();
                    r.setId(item.getId());
                    r.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
                    r.setProductName(item.getProductName());
                    r.setProductPrice(item.getProductPrice());
                    r.setQuantity(item.getQuantity());
                    r.setSubtotal(item.getSubtotal());
                    return r;
                })
                .collect(Collectors.toList());

        OrderDTO.OrderResponse response = new OrderDTO.OrderResponse();
        response.setId(order.getId());
        response.setStatus(order.getStatus().name());
        response.setTotalAmount(order.getTotalAmount());
        response.setShippingAddress(order.getShippingAddress());
        response.setOrderItems(itemResponses);
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        return response;
    }
}
