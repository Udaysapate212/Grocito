package com.example.Grocito.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_partners")
public class DeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "contact_number")
    private String contactNumber;
    
    private String address;
    
    private String pincode;
    
    @Column(name = "registered_date")
    private LocalDateTime registeredDate;
    
    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "status")
    private String status; // [ ACTIVE / OFFLINE / BUSY ]
    
    @OneToMany(mappedBy = "deliveryPartner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Order> orders = new ArrayList<>();

    public DeliveryPartner() {
        this.registeredDate = LocalDateTime.now();
        this.isActive = true;
        this.status = "OFFLINE";
    }

    public DeliveryPartner(String fullName, String email, String password, String contactNumber, 
                          String address, String pincode) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.contactNumber = contactNumber;
        this.address = address;
        this.pincode = pincode;
        this.registeredDate = LocalDateTime.now();
        this.isActive = true;
        this.status = "OFFLINE";
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

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
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

    public LocalDateTime getRegisteredDate() {
        return registeredDate;
    }

    public void setRegisteredDate(LocalDateTime registeredDate) {
        this.registeredDate = registeredDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public void addOrder(Order order) {
        orders.add(order);
        order.setDeliveryPartner(this);
    }

    public void removeOrder(Order order) {
        orders.remove(order);
        order.setDeliveryPartner(null);
    }

    @Override
    public String toString() {
        return "DeliveryPartner [id=" + id + ", fullName=" + fullName + ", email=" + email + 
               ", contactNumber=" + contactNumber + ", pincode=" + pincode + ", status=" + status + "]";
    }
}
