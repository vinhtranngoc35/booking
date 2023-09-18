package com.example.booking.controller.rest;

import com.example.booking.domain.File;
import com.example.booking.service.file.UploadFileService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@AllArgsConstructor
public class FileRestController {
    private final UploadFileService uploadFileService;

    @PostMapping
    public File upload(@RequestParam("avatar") MultipartFile avatar) throws IOException {
        return uploadFileService.saveAvatar(avatar);
    }
}