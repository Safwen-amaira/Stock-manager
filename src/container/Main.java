package container;

	import javafx.application.Application;
	import javafx.geometry.Pos;
	import javafx.scene.Scene;
	import javafx.scene.control.Button;
	import javafx.scene.control.Label;
	import javafx.scene.layout.VBox;
	import javafx.stage.Stage;

public class Main extends Application {
	 	@Override
	 		public void start(Stage primaryStage) {
	        // Create a label
	        Label label = new Label("Hello, JavaFX!");
	        // Create a button
	        
	        Button button = new Button("Click me");
	        button.setOnAction(e -> label.setText("Button clicked!"));
	        
	        // Create a VBox layout and add controls
	        VBox vbox = new VBox(10);  // 10 is the spacing between elements
	        vbox.setAlignment(Pos.CENTER);
	        vbox.getChildren().addAll(label, button);

	        // Create the scene
	        Scene scene = new Scene(vbox, 300, 200);

	        // Set the stage
	        primaryStage.setTitle("Simple JavaFX Application");
	        primaryStage.setScene(scene);
	        primaryStage.show();
	    }

	    public static void main(String[] args) {
	        launch(args);
	    }
	}
