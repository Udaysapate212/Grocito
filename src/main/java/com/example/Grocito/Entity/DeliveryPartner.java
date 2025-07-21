package com.example.Grocito.Entity;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_partners")
public class DeliveryPartner {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    private String address;
    private String pincode;
    private String contactNumber;
    private LocalDate registeredDate;
    private boolean isActive;
    
    @OneToMany(mappedBy = "deliveryPartner", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Order> assignedOrders;
    
    public DeliveryPartner() {
        super();
    }

    public DeliveryPartner(Long id, String fullName, String email, String password, String address, String pincode,
            String contactNumber, LocalDate registeredDate, boolean isActive, List<Order> assignedOrders) {
        super();
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.address = address;
        this.pincode = pincode;
        this.contactNumber = contactNumber;
        this.registeredDate = registeredDate;
        this.isActive = isActive;
        this.assignedOrders = assignedOrders;
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

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public LocalDate getRegisteredDate() {
        return registeredDate;
    }

    public void setRegisteredDate(LocalDate registeredDate) {
        this.registeredDate = registeredDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public List<Order> getAssignedOrders() {
        return assignedOrders;
    }

    public void setAssignedOrders(List<Order> assignedOrders) {
        this.assignedOrders = assignedOrders;
    }

    @Override
    public String toString() {
        return "DeliveryPartner [id=" + id + ", fullName=" + fullName + ", email=" + email + ", address=" + address
                + ", pincode=" + pincode + ", contactNumber=" + contactNumber + ", registeredDate=" + registeredDate
                + ", isActive=" + isActive + "]";
    }
}