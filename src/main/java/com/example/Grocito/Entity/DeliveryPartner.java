package com.example.Grocito.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_partners")
public class DeliveryPartner {

    @Id
    private Long id;

    private String name;
    private String phone;
    private String pincode;

    private String status; // [ ACTIVE / OFFLINE / BUSY ]

	public DeliveryPartner() {
		super();
		// TODO Auto-generated constructor stub
	}

	public DeliveryPartner(Long id, String name, String phone, String pincode, String status) {
		super();
		this.id = id;
		this.name = name;
		this.phone = phone;
		this.pincode = pincode;
		this.status = status;
	}

    // Getters & Setters

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPincode() {
		return pincode;
	}

	public void setPincode(String pincode) {
		this.pincode = pincode;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "DeliveryPartner [id=" + id + ", name=" + name + ", phone=" + phone + ", pincode=" + pincode
				+ ", status=" + status + "]";
	}
    
    

}
