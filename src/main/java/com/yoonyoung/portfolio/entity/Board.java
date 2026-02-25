package com.yoonyoung.portfolio.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter // Lombok 사용 시 편리함
@Setter
@NoArgsConstructor // 기본 생성자
@Table(name = "portfolio_board") // DB의 테이블 이름과 일치시켜야 합니다!
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL의 Auto Increment와 매핑
    private Long id;

    @Column(nullable = false, length = 100) // NN(Not Null) 설정 반영
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false) // TEXT 타입 반영
    private String text;

    @Column(length = 45)
    private String author;

    @CreationTimestamp // 글 생성 시 현재 시간 자동 입력
    @Column(updatable = false)
    private LocalDateTime created_at;

}