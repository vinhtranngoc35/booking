package com.example.booking.controller.rest;

import com.example.booking.service.room.RoomService;
import com.example.booking.service.room.request.RoomSaveRequest;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/rooms")
@AllArgsConstructor
public class RoomRestController {

    private final RoomService roomService;
    
    @PostMapping
    public void create(@RequestBody RoomSaveRequest request){
        roomService.create(request);
    }
}
