package com.example.booking.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Table
@Entity
@Data
@NoArgsConstructor
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private String customerPhoneNumber;

    private String customerEmail;

    private LocalDateTime dateOfArrival;

    private LocalDateTime dateOfDeparture;

    @ManyToOne
    private Customer customer;

    @OneToMany(mappedBy = "bill")
    private List<BillRoom> billRooms;

    @OneToMany(mappedBy = "bill")
    private List<BillService> billServices;

}
