package com.example.booking.domain;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private BigDecimal price;

    private BigDecimal priceWeekend;

    @Column(columnDefinition = "long_text")
    private String description;

    private Integer capacityAdult;


    private Integer capacityChild;

    private Integer amountBed;

    @OneToOne
    private File poster;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private Type type;

    @OneToMany(mappedBy = "room")
    private List<RoomCategory> roomCategories;

    @OneToMany(mappedBy = "room")
    private List<RoomService> roomServices;

    @OneToMany(mappedBy = "room")
    private List<File> files;
}
