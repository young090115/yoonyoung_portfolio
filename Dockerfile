# 1. 빌드 스테이지
FROM gradle:7.6-jdk17 AS build
WORKDIR /app
COPY . .
# gradlew 대신 설치된 gradle 명령어를 직접 사용합니다.
RUN gradle bootJar --no-daemon

# 2. 실행 스테이지
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]