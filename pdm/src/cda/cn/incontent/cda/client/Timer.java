package cn.incontent.cda.client;

public class Timer {

	private long start = System.nanoTime();

	public void call() {
		call("");
	}
	
	public void call(Object flag) {
		long e = System.nanoTime();
		System.out.println(flag + ">>>>>>" + (double)(e - start) / 1000000 + "ms");

		start = e;
	}
	
	public double getRange() {
		long e = System.nanoTime();
		return (double)(e - start) / 1000000;
	}

	public String getPeriod() {
		long e = System.nanoTime();
		String s = ((double)(e - start) / 1000000 + "ms");

		start = e;

		return s;
	}

}
