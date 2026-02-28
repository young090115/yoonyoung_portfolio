# 1. 빌드 스테이지
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app
COPY . .
# 권한 부여 및 빌드 (오류 방지를 위해 경로 강제 지정)
RUN chmod +x ./gradlew && ./gradlew bootJar

# 2. 실행 스테이지
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# 빌드된 jar 파일을 안전하게 복사
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]