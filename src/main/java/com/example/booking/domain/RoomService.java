package com.example.booking.domain;

import com.example.booking.domain.enumration.EPriority;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "room_services")
@Entity
@Data
@NoArgsConstructor
public class RoomService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Room room;

    @Enumerated(EnumType.STRING)
    private EPriority priority;


    @ManyToOne
    private Service service;

    public RoomService(Room room, Service service) {
        this.room = room;
        this.service = service;
    }
}
