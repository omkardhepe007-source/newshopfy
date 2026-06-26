# ==============================
# Backend Dockerfile
# Multi-stage: Maven build → slim JRE runtime
# ==============================

# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Run
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /app/target/shopeasy-backend-1.0.0.jar app.jar
EXPOSE 8080

# Activate 'prod' Spring profile when SPRING_PROFILES_ACTIVE=prod is set
# Falls back to default (application.properties) if not set
ENTRYPOINT ["java", "-jar", "app.jar"]
