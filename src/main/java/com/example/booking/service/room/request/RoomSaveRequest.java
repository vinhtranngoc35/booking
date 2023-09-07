package com.example.booking.service.room.request;

import com.example.booking.service.request.SelectOptionRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.NumberFormat;

import java.util.List;

@Data
@NoArgsConstructor
public class RoomSaveRequest {

    private String name;

    private String price;

    private String description;

    private List<String> idCategories;

    private SelectOptionRequest type;
}
