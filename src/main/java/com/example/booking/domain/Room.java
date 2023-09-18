package com.example.booking.domain;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private BigDecimal price;

    private BigDecimal priceWeekend;

    private String description;

    private Integer capacityAdult;


    private Integer capacityChild;

    private Integer amountBed;

    @OneToOne
    private File poster;

    //
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id")
    private Type type;

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY)
    private List<RoomCategory> roomCategories;



    @OneToMany(mappedBy = "room")
    private List<File> files;

    @Override
    public String toString() {
        return super.toString();
    }
}