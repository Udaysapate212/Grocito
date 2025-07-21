package com.example.Grocito.dto;

public class DeliveryPartnerLoginResponseDTO {
    private String token;
    private DeliveryPartnerDTO partner;
    
    public DeliveryPartnerLoginResponseDTO() {
    }
    
    public DeliveryPartnerLoginResponseDTO(String token, DeliveryPartnerDTO partner) {
        this.token = token;
        this.partner = partner;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public DeliveryPartnerDTO getPartner() {
        return partner;
    }

    public void setPartner(DeliveryPartnerDTO partner) {
        this.partner = partner;
    }
}