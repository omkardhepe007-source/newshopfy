package com.shopeasy.controller;

import com.shopeasy.dto.ApiResponse;
import com.shopeasy.dto.ProductDTO;
import com.shopeasy.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ProductController - Two sets of endpoints:
 *
 * PUBLIC (GET): browsing, searching, filtering, product details
 * ADMIN (POST/PUT/DELETE): create, update, delete products
 *
 * @PreAuthorize("hasRole('ADMIN')") secures admin endpoints at the method level
 * for extra safety, in addition to SecurityConfig URL patterns.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product browsing and management APIs")
public class ProductController {

    private final ProductService productService;

    // ========== PUBLIC ENDPOINTS ==========

    @GetMapping
    @Operation(summary = "Get all active products (with optional search/filter)")
    public ResponseEntity<ApiResponse<List<ProductDTO.Response>>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success("Products fetched",
                productService.searchProducts(keyword, category)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product details by ID")
    public ResponseEntity<ApiResponse<ProductDTO.Response>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Product fetched",
                productService.getProductById(id)));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all distinct product categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success("Categories fetched",
                productService.getAllCategories()));
    }

    // ========== ADMIN ENDPOINTS ==========

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: Create a new product")
    public ResponseEntity<ApiResponse<ProductDTO.Response>> createProduct(
            @Valid @RequestBody ProductDTO.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Product created", productService.createProduct(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: Update an existing product")
    public ResponseEntity<ApiResponse<ProductDTO.Response>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO.Request request) {
        return ResponseEntity.ok(ApiResponse.success("Product updated",
                productService.updateProduct(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: Soft-delete a product")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted"));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: Get all products including inactive ones")
    public ResponseEntity<ApiResponse<List<ProductDTO.Response>>> getAllProductsAdmin() {
        return ResponseEntity.ok(ApiResponse.success("All products fetched",
                productService.getAllProductsAdmin()));
    }
}
