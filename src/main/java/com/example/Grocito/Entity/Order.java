package com.example.Grocito.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "orders")
public class Order {
    
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;


    private String status; // [ PLACED / PACKED / OUT_FOR_DELIVERY / DELIVERED ]
    private LocalDateTime orderTime;
    private String deliveryAddress;
    private String pincode;
    private double totalAmount;

    @ManyToOne
    @JoinColumn(name = "user_id")
//    @JsonIgnore
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<OrderItem> items = new ArrayList<>();


	public Order() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Order(Long id, String status, LocalDateTime orderTime, String deliveryAddress, String pincode, double totalAmount, User user,
			List<OrderItem> items) {
		super();
		this.id = id;
		this.status = status;
		this.orderTime = orderTime;
		this.deliveryAddress = deliveryAddress;
		this.pincode = pincode;
		this.totalAmount = totalAmount;
		this.user = user;
		this.items = items;
	}

	
	// Getters & Setters
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getOrderTime() {
		return orderTime;
	}

	public void setOrderTime(LocalDateTime orderTime) {
		this.orderTime = orderTime;
	}

	public String getDeliveryAddress() {
		return deliveryAddress;
	}

	public void setDeliveryAddress(String deliveryAddress) {
		this.deliveryAddress = deliveryAddress;
	}

	public String getPincode() {
		return pincode;
	}

	public void setPincode(String pincode) {
		this.pincode = pincode;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<OrderItem> getItems() {
		return items;
	}

	public void setItems(List<OrderItem> items) {
		this.items = items;
	}
	
	public double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}

	@Override
	public String toString() {
		return "Order [id=" + id + ", status=" + status + ", orderTime=" + orderTime + ", deliveryAddress="
				+ deliveryAddress + ", pincode=" + pincode + ", totalAmount=" + totalAmount + ", user=" + user 
				+ ", itemsCount=" + (items != null ? items.size() : 0)+ "]";
	}
    
	
}
