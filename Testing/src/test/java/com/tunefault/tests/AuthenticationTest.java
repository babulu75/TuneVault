package com.tunefault.tests;

import static org.testng.Assert.assertTrue;

import java.util.UUID;
import org.openqa.selenium.By;
import org.testng.annotations.Test;

public class AuthenticationTest extends BaseTest {
    @Test
    public void userCanSignUpThenSignIn() {
        String username = "test_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String password = "SeleniumTest123!";

        driver.get(baseUrl + "/login");
        driver.findElement(By.cssSelector(".link-btn")).click();
        driver.findElement(By.id("login-username")).sendKeys(username);
        driver.findElement(By.id("login-email")).sendKeys(username + "@example.test");
        driver.findElement(By.id("login-password")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        wait.until(d -> d.getCurrentUrl().endsWith("/"));

        driver.findElement(By.cssSelector(".sidebar__logout")).click();
        wait.until(d -> d.getCurrentUrl().endsWith("/login"));
        driver.findElement(By.id("login-username")).sendKeys(username);
        driver.findElement(By.id("login-password")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        wait.until(d -> d.getCurrentUrl().endsWith("/"));

        assertTrue(driver.findElement(By.cssSelector(".sidebar__username")).getText().contains(username));
    }
}
