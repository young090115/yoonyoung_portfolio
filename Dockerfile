# 1. 빌드 스테이지
FROM eclipse-temurin:17-jdk-jammy AS build
COPY . .
RUN ./gradlew bootJar

# 2. 실행 스테이지
FROM eclipse-temurin:17-jre-jammy
COPY --from=build /build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
