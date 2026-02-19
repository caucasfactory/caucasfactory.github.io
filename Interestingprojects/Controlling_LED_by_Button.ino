void setup()
{
Serial.begin(9600);
  pinMode(9, INPUT);
  pinMode(13, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(11, OUTPUT);
  
}

void loop()
{
 digitalWrite(13, 1);
  delay(800);
 digitalWrite(12, 0); 
  delay(1800);
 digitalWrite(13, 0);
 //delay(1000);
 digitalWrite(13, 1);
  delay(800);
  digitalWrite(13, 0);
  delay(800);
  digitalWrite(13, 1);
  digitalWrite(12, 1);
  delay(800);
  digitalWrite(13, 0);
  delay(1200);
  digitalWrite(11, 1);
  delay(800);
  digitalWrite(12, 0);
  delay(1800);
  digitalWrite(11, 0);
  delay(800);
  digitalWrite(11, 1);
  delay(800);
  digitalWrite(11, 0);
  delay(800);
  digitalWrite(11, 1);
  digitalWrite(12, 1);
  delay(800);
  digitalWrite(11, 1);
  delay(1800);
  
  
// Serial.print(digitalRead(9));
  
  

  
}