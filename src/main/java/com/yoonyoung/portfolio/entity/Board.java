package com.yoonyoung.portfolio.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "portfolio_board") // DB 테이블 이름과 반드시 일치해야 함
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    @Column(length = 45)
    private String author;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false) // DB 컬럼명을 명시적으로 지정
    private LocalDateTime createdAt; // 자바 표준 관례에 따라 createdAt으로 변경 (컬럼명은 created_at으로 매핑)

}