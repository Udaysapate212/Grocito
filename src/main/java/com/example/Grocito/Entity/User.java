package com.example.Grocito.Entity;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    private Long id;

    private String fullName;
    private String email;
    private String password;
    private String role; // [ USER / ADMIN / DELIVERY_PARTNER ]
    private String address;
    private String pincode;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Order> orders;

    
    
    public User() {
		super();
		// TODO Auto-generated constructor stub
	}
    
    

	public User(Long id, String fullName, String email, String password, String role, String address, String pincode,
			List<Order> orders) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.email = email;
		this.password = password;
		this.role = role;
		this.address = address;
		this.pincode = pincode;
		this.orders = orders;
	}



	// Getters & Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPincode() {
		return pincode;
	}

	public void setPincode(String pincode) {
		this.pincode = pincode;
	}

	public List<Order> getOrders() {
		return orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", fullName=" + fullName + ", email=" + email + ", password=" + password + ", role="
				+ role + ", address=" + address + ", pincode=" + pincode + ", orders=" + orders + "]";
	}

    
}
