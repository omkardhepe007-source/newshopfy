package com.shopeasy.controller;

import com.shopeasy.dto.ApiResponse;
import com.shopeasy.dto.OrderDTO;
import com.shopeasy.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * OrderController - Order placement and history APIs.
 * POST /api/orders/place   → Checkout (authenticated customers)
 * GET  /api/orders/my      → My order history
 * GET  /api/orders/{id}    → Specific order details
 * GET  /api/orders/admin/all → All orders (admin)
 * PUT  /api/orders/admin/{id}/status → Update status (admin)
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order placement and management APIs")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    @Operation(summary = "Place an order from current cart")
    public ResponseEntity<ApiResponse<OrderDTO.OrderResponse>> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) OrderDTO.PlaceOrderRequest request) {
        if (request == null) request = new OrderDTO.PlaceOrderRequest();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully",
                        orderService.placeOrder(userDetails.getUsername(), request)));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's order history")
    public ResponseEntity<ApiResponse<List<OrderDTO.OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Orders fetched",
                orderService.getMyOrders(userDetails.getUsername())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order details by ID")
    public ResponseEntity<ApiResponse<OrderDTO.OrderResponse>> getOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order fetched",
                orderService.getOrderById(userDetails.getUsername(), id)));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: Get all orders")
    public ResponseEntity<ApiResponse<List<OrderDTO.OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("All orders fetched",
                orderService.getAllOrders()));
    }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: Update order status")
    public ResponseEntity<ApiResponse<OrderDTO.OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Order status updated",
                orderService.updateOrderStatus(id, status)));
    }
}
