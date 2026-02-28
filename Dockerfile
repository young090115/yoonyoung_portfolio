# 1. 빌드 스테이지
FROM eclipse-temurin:17-jdk-jammy AS build
COPY . .
# 권한 부여 명령어(chmod)를 추가하거나, 직접 gradlew를 실행하지 않는 방식 사용
RUN chmod +x ./gradlew && ./gradlew bootJar

# 2. 실행 스테이지
FROM eclipse-temurin:17-jre-jammy
COPY --from=build /build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]