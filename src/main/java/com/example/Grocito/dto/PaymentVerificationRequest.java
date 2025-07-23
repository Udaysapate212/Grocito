package com.example.Grocito.dto;

public class PaymentVerificationRequest {
    private String paymentId;
    private String orderId; // Razorpay order ID
    private String signature;
    private Long merchantOrderId; // Our system's order ID
    
    public PaymentVerificationRequest() {
        // Default constructor
    }
    
    public String getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    
    public String getOrderId() {
        return orderId;
    }
    
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    
    public String getSignature() {
        return signature;
    }
    
    public void setSignature(String signature) {
        this.signature = signature;
    }
    
    public Long getMerchantOrderId() {
        return merchantOrderId;
    }
    
    public void setMerchantOrderId(Long merchantOrderId) {
        this.merchantOrderId = merchantOrderId;
    }
}