package com.tunefault.tests;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotEquals;
import static org.testng.Assert.assertTrue;

import org.openqa.selenium.By;
import org.testng.annotations.Test;

public class PlayerControlsTest extends BaseTest {
    @Test
    public void userCanPlayThenMoveToNextAndPreviousSong() {
        driver.get(baseUrl + "/");
        wait.until(d -> d.findElements(By.cssSelector(".song-card")).size() > 1);

        driver.findElement(By.cssSelector(".song-play-btn")).click();
        wait.until(d -> d.findElement(By.cssSelector(".audio-player__song")).isDisplayed());
        String firstSong = driver.findElement(By.cssSelector(".audio-player__title")).getText();

        driver.findElement(By.cssSelector("button[aria-label='Next']")).click();
        wait.until(d -> !d.findElement(By.cssSelector(".audio-player__title")).getText().equals(firstSong));
        String nextSong = driver.findElement(By.cssSelector(".audio-player__title")).getText();
        assertNotEquals(nextSong, firstSong);

        driver.findElement(By.cssSelector("button[aria-label='Previous']")).click();
        wait.until(d -> d.findElement(By.cssSelector(".audio-player__title")).getText().equals(firstSong));
        assertEquals(driver.findElement(By.cssSelector(".audio-player__title")).getText(), firstSong);

        driver.findElement(By.cssSelector(".audio-player__song")).click();
        wait.until(d -> d.getCurrentUrl().endsWith("/now-playing"));
        assertTrue(driver.findElement(By.cssSelector(".now-playing")).isDisplayed());
    }
}
