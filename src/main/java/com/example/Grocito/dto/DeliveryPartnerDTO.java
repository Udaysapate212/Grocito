package com.example.Grocito.dto;

import java.time.LocalDateTime;

public class DeliveryPartnerDTO {
    private Long id;
    private String fullName;
    private String email;
    private String contactNumber;
    private String address;
    private String pincode;
    private LocalDateTime registeredDate;
    private boolean isActive;
    private String status;
    
    public DeliveryPartnerDTO() {
    }
    
    public DeliveryPartnerDTO(Long id, String fullName, String email, String contactNumber, 
                             String address, String pincode, LocalDateTime registeredDate, 
                             boolean isActive, String status) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.address = address;
        this.pincode = pincode;
        this.registeredDate = registeredDate;
        this.isActive = isActive;
        this.status = status;
    }

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
}