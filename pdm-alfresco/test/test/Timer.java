package test;

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

	public String getPeriod() {
		long e = System.nanoTime();
		String s = ((double)(e - start) / 1000000 + "ms");

		start = e;

		return s;
	}

}
