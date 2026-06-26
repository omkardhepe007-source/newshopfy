package com.shopeasy.controller;

import com.shopeasy.dto.ApiResponse;
import com.shopeasy.dto.CartDTO;
import com.shopeasy.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * CartController - All endpoints require authentication.
 * We use @AuthenticationPrincipal to get the currently logged-in user's email
 * from the Security Context — avoids needing userId in the URL.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart management APIs")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "View current user's cart")
    public ResponseEntity<ApiResponse<CartDTO.CartResponse>> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Cart fetched",
                cartService.getCart(userDetails.getUsername())));
    }

    @PostMapping("/add")
    @Operation(summary = "Add a product to cart")
    public ResponseEntity<ApiResponse<CartDTO.CartResponse>> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CartDTO.AddItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Item added to cart",
                cartService.addToCart(userDetails.getUsername(), request)));
    }

    @PutMapping("/update/{cartItemId}")
    @Operation(summary = "Update quantity of a cart item")
    public ResponseEntity<ApiResponse<CartDTO.CartResponse>> updateCartItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId,
            @RequestParam int quantity) {
        return ResponseEntity.ok(ApiResponse.success("Cart updated",
                cartService.updateCartItem(userDetails.getUsername(), cartItemId, quantity)));
    }

    @DeleteMapping("/remove/{cartItemId}")
    @Operation(summary = "Remove a specific item from cart")
    public ResponseEntity<ApiResponse<CartDTO.CartResponse>> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long cartItemId) {
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart",
                cartService.removeFromCart(userDetails.getUsername(), cartItemId)));
    }
}
