package com.shopeasy.service;

import com.shopeasy.dto.CartDTO;
import com.shopeasy.entity.*;
import com.shopeasy.exception.ResourceNotFoundException;
import com.shopeasy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * CartService - Manages the shopping cart for authenticated customers.
 *
 * Add to cart logic:
 *  - If product already in cart → increase quantity
 *  - If new product → create CartItem
 *  - Always checks stock availability
 *
 * Remove item: deletes CartItem by ID (validates ownership)
 * Update quantity: replaces quantity, or removes if quantity becomes 0
 * View cart: loads cart with all items and calculates total
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public CartDTO.CartResponse addToCart(String userEmail, CartDTO.AddItemRequest request) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (!product.isActive()) {
            throw new IllegalArgumentException("Product is no longer available.");
        }
        if (product.getStock() < request.getQuantity()) {
            throw new IllegalArgumentException("Insufficient stock. Available: " + product.getStock());
        }

        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + request.getQuantity();
            if (product.getStock() < newQty) {
                throw new IllegalArgumentException("Insufficient stock. Available: " + product.getStock());
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(newItem);
            cart.getItems().add(newItem);
        }

        return mapToCartResponse(cartRepository.findByUser(user).orElse(cart));
    }

    @Transactional
    public CartDTO.CartResponse updateCartItem(String userEmail, Long cartItemId, int quantity) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to this user.");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            if (item.getProduct().getStock() < quantity) {
                throw new IllegalArgumentException("Insufficient stock. Available: " + item.getProduct().getStock());
            }
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToCartResponse(cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found")));
    }

    @Transactional
    public CartDTO.CartResponse removeFromCart(String userEmail, Long cartItemId) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", "id", cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to this user.");
        }

        cartItemRepository.delete(item);

        return mapToCartResponse(cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found")));
    }

    @Transactional
    public void clearCart(Cart cart) {
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public CartDTO.CartResponse getCart(String userEmail) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);
        return mapToCartResponse(cart);
    }

    // ========== HELPERS ==========

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = Cart.builder().user(user).build();
            return cartRepository.save(newCart);
        });
    }

    private CartDTO.CartResponse mapToCartResponse(Cart cart) {
        List<CartDTO.CartItemResponse> itemResponses = cart.getItems().stream()
                .map(item -> {
                    CartDTO.CartItemResponse r = new CartDTO.CartItemResponse();
                    r.setCartItemId(item.getId());
                    r.setProductId(item.getProduct().getId());
                    r.setProductName(item.getProduct().getName());
                    r.setProductImageUrl(item.getProduct().getImageUrl());
                    r.setProductPrice(item.getProduct().getPrice());
                    r.setQuantity(item.getQuantity());
                    r.setSubtotal(item.getSubtotal());
                    return r;
                })
                .collect(Collectors.toList());

        CartDTO.CartResponse response = new CartDTO.CartResponse();
        response.setCartId(cart.getId());
        response.setItems(itemResponses);
        response.setTotalPrice(cart.getTotalPrice());
        response.setTotalItems(itemResponses.size());
        return response;
    }
}
