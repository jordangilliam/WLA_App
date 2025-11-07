package com.trouttower;


import com.trouttower.views.GameFrame;

import javax.swing.*;

public class Main {
    public static void main(String[] args) {
        final GameFrame app=new GameFrame();
        SwingUtilities.invokeLater (() -> app.setVisible(true));
    }
}

