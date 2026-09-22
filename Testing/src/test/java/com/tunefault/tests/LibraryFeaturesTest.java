package com.tunefault.tests;

import static org.testng.Assert.assertTrue;

import java.util.UUID;
import org.openqa.selenium.By;
import org.testng.annotations.Test;

public class LibraryFeaturesTest extends BaseTest {
    @Test
    public void signedInUserCanFavoriteAndAddSongToPlaylist() {
        String username = "test_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String playlistName = "My Selenium Playlist";

        driver.get(baseUrl + "/login");
        driver.findElement(By.cssSelector(".link-btn")).click();
        driver.findElement(By.id("login-username")).sendKeys(username);
        driver.findElement(By.id("login-email")).sendKeys(username + "@example.test");
        driver.findElement(By.id("login-password")).sendKeys("SeleniumTest123!");
        driver.findElement(By.cssSelector("button[type='submit']")).click();
        wait.until(d -> d.getCurrentUrl().endsWith("/"));

        driver.findElement(By.cssSelector("button[aria-label='Add to favorites']")).click();
        driver.findElement(By.linkText("Favorites")).click();
        wait.until(d -> d.findElements(By.cssSelector(".song-card")).size() == 1);

        driver.findElement(By.linkText("Playlists")).click();
        driver.findElement(By.xpath("//button[normalize-space()='New']")).click();
        driver.findElement(By.id("playlist-name")).sendKeys(playlistName);
        driver.findElement(By.cssSelector("form.create-form button[type='submit']")).click();
        wait.until(d -> d.findElement(By.cssSelector(".playlist-card")).isDisplayed());

        driver.findElement(By.linkText("Home")).click();
        driver.findElement(By.cssSelector("button[aria-label='More options']")).click();
        wait.until(d -> d.findElement(By.xpath("//button[normalize-space()='" + playlistName + "']")).isDisplayed());
        driver.findElement(By.xpath("//button[normalize-space()='" + playlistName + "']")).click();

        driver.findElement(By.linkText("Playlists")).click();
        driver.findElement(By.cssSelector(".playlist-card")).click();
        wait.until(d -> d.findElements(By.cssSelector(".song-card")).size() == 1);
        assertTrue(driver.findElement(By.cssSelector(".song-card")).isDisplayed());
    }
}
