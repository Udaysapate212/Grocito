package com.example.Grocito.dto;

public class DeliveryPartnerLoginDTO {
    private String email;
    private String password;
    
    public DeliveryPartnerLoginDTO() {
    }
    
    public DeliveryPartnerLoginDTO(String email, String password) {
        this.email = email;
        this.password = password;
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
}