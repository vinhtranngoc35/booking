package com.example.booking.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Table
@Entity
@Getter
@Setter
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

    @ManyToOne(optional = false)
    private Customer customer;

    @OneToMany(mappedBy = "bill")
    private List<BillRoom> billRooms;

    @OneToMany(mappedBy = "bill")
    private List<BillService> billServices;

}