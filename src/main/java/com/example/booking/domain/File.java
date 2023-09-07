package com.example.booking.domain;

import com.example.booking.domain.enumration.ETypeFile;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "files")
@Data
@NoArgsConstructor
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ETypeFile type;

    private String url;

    @ManyToOne
    private Room room;
}
