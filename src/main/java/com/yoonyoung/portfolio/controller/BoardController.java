package com.yoonyoung.portfolio.controller;

import com.yoonyoung.portfolio.entity.Board;
import com.yoonyoung.portfolio.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;
import java.util.List;

@RestController // JSON 형태로 데이터를 주고받기 위해 사용합니다.
@RequestMapping("/api/comments") // 공통 경로 설정
@RequiredArgsConstructor // 레포지토리 주입(Constructor Injection)
public class BoardController {

    private final BoardRepository boardRepository;

    // [조회] GET /api/comments
    @GetMapping
    public List<Board> getAllComments() {
        // 모든 댓글을 가져오되, 최신순(ID 역순)으로 정렬해서 반환합니다.
        return boardRepository.findAllByOrderByIdDesc();
    }

    // [저장] POST /api/comments
    @PostMapping
    public Board createComment(@RequestBody @NonNull Board board) {
        return boardRepository.save(board);
    }

    // BoardController.java에 추가
    @SuppressWarnings("null")
    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable Long id) {
        boardRepository.deleteById(id);
    }

}