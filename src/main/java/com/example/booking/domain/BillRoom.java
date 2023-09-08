package com.example.booking.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "bill_rooms")
@Data
@NoArgsConstructor
public class BillRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String serviceName;

    private BigDecimal price;

    @ManyToOne
    private Room room;

    @ManyToOne
    private Bill bill;
}
