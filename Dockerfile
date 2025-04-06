FROM openjdk:17
EXPOSE 8083
ADD target/FemiStoreProduct-0.0.1-SNAPSHOT.jar femistoreproduct.jar
ENTRYPOINT ["java", "-jar", "femistoreproduct.jar"]