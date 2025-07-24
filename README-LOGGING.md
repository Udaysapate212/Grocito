 Grocito Application Logging Implementation

## Overview

This document provides information about the logging implementation in the Grocito application. Logging has been added to provide better visibility into application behavior, assist with debugging, and monitor application performance.

## Logging Configuration

### Dependencies

The following dependencies have been added to `pom.xml` for logging:

```xml
<!-- Logging dependencies -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
</dependency>
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
</dependency>
```

### Configuration in application.properties

Logging is configured in `application.properties` with the following settings:

```properties
# Logging Configuration
logging.level.root=INFO
logging.level.com.example.Grocito=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
logging.file.name=logs/grocito.log
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

## Logger Configuration Class

A centralized logger configuration class has been created at `com.example.Grocito.Config.LoggerConfig` to provide a consistent way to obtain logger instances throughout the application:

```java
package com.example.Grocito.Config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoggerConfig {
    public static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }
}
```

## Logging Implementation

Logging has been implemented in the following components:

### Controllers
- UserController
- ProductController
- OrderController

### Services
- UserService
- ProductService
- OrderService

## Log Levels Used

- **ERROR**: Used for exceptions and critical failures that prevent normal operation
- **WARN**: Used for non-critical issues that might require attention
- **INFO**: Used for significant application events (user registration, order placement, etc.)
- **DEBUG**: Used for detailed information useful during development and troubleshooting

## Log Message Format

Log messages follow this general format:

```
[TIMESTAMP] [THREAD] [LOG_LEVEL] [LOGGER_NAME] - [MESSAGE]
```

Example:
```
2023-05-15 14:30:45 [http-nio-8080-exec-1] INFO  c.e.G.Controller.UserController - User registered successfully with ID: 123
```

## Log File Location

Log files are stored in the `logs/grocito.log` file in the application root directory.

## Best Practices Followed

1. **Consistent Logging**: Using the centralized LoggerConfig class
2. **Appropriate Log Levels**: Using the right level for different types of messages
3. **Contextual Information**: Including relevant IDs and data in log messages
4. **Exception Logging**: Properly logging exceptions with context
5. **Performance Consideration**: Using isDebugEnabled() checks for expensive log operations

## Maintenance

To modify logging configuration:

1. Edit the logging properties in `application.properties`
2. For more advanced configuration, consider creating a `logback.xml` file in the resources directory