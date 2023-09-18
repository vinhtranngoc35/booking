package com.example.booking.service.room;

import com.example.booking.domain.Category;
import com.example.booking.domain.Room;
import com.example.booking.domain.RoomCategory;
import com.example.booking.domain.Type;
import com.example.booking.repository.FileRepository;
import com.example.booking.repository.RoomCategoryRepository;
import com.example.booking.repository.RoomRepository;
import com.example.booking.service.dto.request.SelectOptionRequest;
import com.example.booking.service.room.request.RoomSaveRequest;
import com.example.booking.service.room.response.RoomDetailResponse;
import com.example.booking.service.room.response.RoomListResponse;
import com.example.booking.util.AppUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class RoomService {

    private final RoomRepository roomRepository;

    private final RoomCategoryRepository roomCategoryRepository;

    private final FileRepository fileRepository;


    public void create(RoomSaveRequest request){
        var room = AppUtil.mapper.map(request, Room.class);

        room = roomRepository.save(room);
        var files = fileRepository.findAllById(request.getFiles().stream().map(SelectOptionRequest::getId).collect(Collectors.toList()));
        for (var file: files) {
            file.setRoom(room);
        }
        fileRepository.saveAll(files);
////        var roomCategories = new ArrayList<RoomCategory>();
//        for (var id: request.getIdCategories()) {
//            roomCategories.add(new RoomCategory(room, new Category(Long.valueOf(id))));
//        }
//        roomCategoryRepository.saveAll(roomCategories);
        Room finalRoom = room;
        roomCategoryRepository.saveAll(request
                .getIdCategories()
                .stream()
                .map(id -> new RoomCategory(finalRoom, new Category(Long.valueOf(id))))
                .collect(Collectors.toList()));
    }

    public RoomDetailResponse findById(Long id){
        var room = roomRepository.findById(id).orElse(new Room());
//        var result = new RoomDetailResponse();
//        result.setId(room.getId());
//        result.setName(room.getName());
//        result.setPrice(room.getPrice());
//        result.setDescription(room.getDescription());
        var result = AppUtil.mapper.map(room, RoomDetailResponse.class);
        result.setTypeId(room.getType().getId());
        result.setCategoryIds(room
                .getRoomCategories()
                .stream().map(roomCategory -> roomCategory.getCategory().getId())
                .collect(Collectors.toList()));
//        var categoryIds = new ArrayList<Long>();
//
//        for (var roomCategory: room.getRoomCategories()) {
//            categoryIds.add(roomCategory.getCategory().getId());
//        }
//        result.setCategoryIds(categoryIds);
        return result;
    }

    public Page<RoomListResponse> getRooms(Pageable pageable){
        return roomRepository.findAll(pageable).map(e -> {
            var result = AppUtil.mapper.map(e, RoomListResponse.class);
            result.setType(e.getType().getName());
            result.setCategories(e.getRoomCategories()
                    .stream().map(c -> c.getCategory().getName())
                    .collect(Collectors.joining(", ")));
            return result;
        });
    }

    public void update(RoomSaveRequest request, Long id){
        var roomDb = roomRepository.findById(id).orElse(new Room());
        roomDb.setType(new Type());
        AppUtil.mapper.map(request,roomDb);
        roomCategoryRepository.deleteAll(roomDb.getRoomCategories());


        var roomCategories = new ArrayList<RoomCategory>();
        for (String idCategory : request.getIdCategories()) {
            Category category = new Category(Long.valueOf(idCategory));
            roomCategories.add(new RoomCategory(roomDb, category));
        }
        roomCategoryRepository.saveAll(roomCategories);
        roomRepository.save(roomDb);
    }
}