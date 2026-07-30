package com.velvetbloom.ar.common;

import java.util.Locale;

public final class Slugs {

    private Slugs() {}

    /** Mirrors the Node slug logic: lowercase, non-alphanumeric runs -> '-'. */
    public static String slugify(String input) {
        if (input == null) return "";
        return input.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }
}
