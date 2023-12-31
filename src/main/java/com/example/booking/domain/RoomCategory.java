package com.example.booking.domain;

import com.example.booking.domain.enumration.EPriority;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "room_categories")
@Entity
@Data
@NoArgsConstructor
public class RoomCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Room room;

    @Enumerated(EnumType.STRING)
    private EPriority priority;


    @ManyToOne
    private Category category;

    public RoomCategory(Room room, Category category) {
        this.room = room;
        this.category = category;
    }
}
