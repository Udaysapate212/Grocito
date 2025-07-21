package com.example.Grocito.dto;

public class DeliveryPartnerRegistrationDTO {
    private String fullName;
    private String email;
    private String password;
    private String contactNumber;
    private String address;
    private String pincode;
    
    public DeliveryPartnerRegistrationDTO() {
    }
    
    public DeliveryPartnerRegistrationDTO(String fullName, String email, String password, 
                                         String contactNumber, String address, String pincode) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.contactNumber = contactNumber;
        this.address = address;
        this.pincode = pincode;
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
}