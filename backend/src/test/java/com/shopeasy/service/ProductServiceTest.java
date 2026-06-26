package com.shopeasy.service;

import com.shopeasy.dto.ProductDTO;
import com.shopeasy.entity.Product;
import com.shopeasy.exception.ResourceNotFoundException;
import com.shopeasy.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * ProductServiceTest - Unit tests for ProductService.
 * Uses Mockito to mock the ProductRepository so no DB is needed.
 * Each test is independent and fast (no Spring context loading).
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        sampleProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .description("Test Description")
                .category("Electronics")
                .price(new BigDecimal("999.99"))
                .stock(10)
                .imageUrl("https://example.com/img.jpg")
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Should create product successfully")
    void shouldCreateProductSuccessfully() {
        ProductDTO.Request request = new ProductDTO.Request();
        request.setName("Test Product");
        request.setDescription("Test Description");
        request.setCategory("Electronics");
        request.setPrice(new BigDecimal("999.99"));
        request.setStock(10);
        request.setImageUrl("https://example.com/img.jpg");

        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        ProductDTO.Response response = productService.createProduct(request);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Test Product");
        assertThat(response.getPrice()).isEqualByComparingTo(new BigDecimal("999.99"));
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("Should return all active products")
    void shouldReturnAllActiveProducts() {
        when(productRepository.findByActiveTrueOrderByCreatedAtDesc())
                .thenReturn(List.of(sampleProduct));

        List<ProductDTO.Response> result = productService.getAllActiveProducts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Test Product");
    }

    @Test
    @DisplayName("Should throw exception when product not found")
    void shouldThrowWhenProductNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Product not found");
    }

    @Test
    @DisplayName("Should soft-delete product (set active=false)")
    void shouldSoftDeleteProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        productService.deleteProduct(1L);

        assertThat(sampleProduct.isActive()).isFalse();
        verify(productRepository, times(1)).save(sampleProduct);
    }

    @Test
    @DisplayName("Should update product fields")
    void shouldUpdateProductSuccessfully() {
        ProductDTO.Request request = new ProductDTO.Request();
        request.setName("Updated Name");
        request.setDescription("Updated Desc");
        request.setCategory("Clothing");
        request.setPrice(new BigDecimal("499.00"));
        request.setStock(5);

        Product updatedProduct = Product.builder()
                .id(1L).name("Updated Name").description("Updated Desc")
                .category("Clothing").price(new BigDecimal("499.00"))
                .stock(5).active(true).build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        ProductDTO.Response response = productService.updateProduct(1L, request);

        assertThat(response.getName()).isEqualTo("Updated Name");
        assertThat(response.getCategory()).isEqualTo("Clothing");
    }

    @Test
    @DisplayName("Should search products by keyword")
    void shouldSearchByKeyword() {
        when(productRepository.searchByKeyword("test")).thenReturn(List.of(sampleProduct));

        List<ProductDTO.Response> result = productService.searchProducts("test", null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).contains("Test");
    }
}
