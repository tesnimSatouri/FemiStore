FROM openjdk:17
EXPOSE 8488
ADD target/FemiStoreProduct-0.0.1-SNAPSHOT.jar femistorecatrorie.jar
ENTRYPOINT ["java", "-jar", "femistorecatrorie.jar"]