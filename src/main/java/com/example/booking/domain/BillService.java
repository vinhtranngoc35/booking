package com.example.booking.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "bill_services")
@Data
@NoArgsConstructor
public class BillService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceName;

    private BigDecimal price;

    @ManyToOne
    private Service service;

    @ManyToOne
    private Bill bill;
}
