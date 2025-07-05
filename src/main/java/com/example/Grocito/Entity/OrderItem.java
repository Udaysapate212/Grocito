package com.example.Grocito.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {
    
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;


    private int quantity;
    private double totalPrice;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;


    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;


	public OrderItem() {
		super();
		// TODO Auto-generated constructor stub
	}

	public OrderItem(Long id, int quantity, double totalPrice, Order order, Product product) {
		super();
		this.id = id;
		this.quantity = quantity;
		this.totalPrice = totalPrice;
		this.order = order;
		this.product = product;
	}
	
    // Getters & Setters


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	@Override
	public String toString() {
		return "OrderItem [id=" + id + ", quantity=" + quantity + ", totalPrice=" + totalPrice + ", order=" + order
				+ ", product=" + product + "]";
	}
    
	
}
