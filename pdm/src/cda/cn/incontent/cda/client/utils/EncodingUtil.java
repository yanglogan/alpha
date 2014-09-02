package cn.incontent.cda.client.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.BitSet;

public class EncodingUtil {

	private static final String DEFAULT_CHARSET = "UTF-8";
	protected static final BitSet WWW_FORM_URL = new BitSet(256);
	protected static byte ESCAPE_CHAR = 37;

	public static String formUrlEncode(NamedValue[] pairs, String charset) {
		try {
			return doFormUrlEncode(pairs, charset);
		} catch (UnsupportedEncodingException e) {
			try {
				return doFormUrlEncode(pairs, DEFAULT_CHARSET);
			} catch (UnsupportedEncodingException e1) {
				throw new RuntimeException("Encoding not supported: "
						+ DEFAULT_CHARSET, e1);
			}
		}
	}
	
	public static String getStringFromStream(InputStream is, String charset) throws UnsupportedEncodingException, IOException {
		
		if (is == null) {
			return null;
		}
		
		return new String(FileCopyUtils.copyToByteArray(is), charset);
	}

	private static String doFormUrlEncode(NamedValue[] pairs, String charset)
			throws UnsupportedEncodingException {
		StringBuffer buf = new StringBuffer();
		for (int i = 0; i < pairs.length; ++i) {
			NamedValue pair = pairs[i];
			if (pair.getName() != null) {
				if (i > 0) {
					buf.append("&");
				}
				buf.append(encode(pair.getName(), charset));
				buf.append("=");
				if (pair.getValue() != null) {
					buf.append(encode(pair.getValue(), charset));
				}
			}
		}
		return buf.toString();
	}

	public static String getString(byte[] data, int offset, int length,
			String charset) {
		if (data == null) {
			throw new IllegalArgumentException("Parameter may not be null");
		}

		if ((charset == null) || (charset.length() == 0)) {
			throw new IllegalArgumentException(
					"charset may not be null or empty");
		}
		try {
			return new String(data, offset, length, charset);
		} catch (UnsupportedEncodingException e) {
		}
		return new String(data, offset, length);
	}

	public static String getString(byte[] data, String charset) {
		return getString(data, 0, data.length, charset);
	}

	public static byte[] getBytes(String data, String charset) {
		if (data == null) {
			throw new IllegalArgumentException("data may not be null");
		}

		if ((charset == null) || (charset.length() == 0)) {
			throw new IllegalArgumentException(
					"charset may not be null or empty");
		}
		try {
			return data.getBytes(charset);
		} catch (UnsupportedEncodingException e) {
		}
		return data.getBytes();
	}

	public static byte[] getAsciiBytes(String data) {
		if (data == null) {
			throw new IllegalArgumentException("Parameter may not be null");
		}
		try {
			return data.getBytes("US-ASCII");
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException("HttpClient requires ASCII support");
		}
	}

	public static String getAsciiString(byte[] data, int offset, int length) {
		if (data == null) {
			throw new IllegalArgumentException("Parameter may not be null");
		}
		try {
			return new String(data, offset, length, "US-ASCII");
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException("HttpClient requires ASCII support");
		}
	}

	public static String getAsciiString(byte[] data) {
		return getAsciiString(data, 0, data.length);
	}

	private static String encode(String str, String charset) throws UnsupportedEncodingException {
		byte[] bytes = str.getBytes(charset);

		if (bytes == null) {
			return null;
		}
		
		ByteArrayOutputStream buffer = new ByteArrayOutputStream();
		for (int i = 0; i < bytes.length; ++i) {
			int b = bytes[i];
			if (b < 0) {
				b = 256 + b;
			}
			if (WWW_FORM_URL.get(b)) {
				if (b == 32) {
					b = 43;
				}
				buffer.write(b);
			} else {
				buffer.write(ESCAPE_CHAR);
				char hex1 = Character.toUpperCase(Character.forDigit(
						b >> 4 & 0xF, 16));
				char hex2 = Character.toUpperCase(Character.forDigit(b & 0xF,
						16));
				buffer.write(hex1);
				buffer.write(hex2);
			}
		}
		byte[] encodedBytes = buffer.toByteArray();

		return new String(encodedBytes, "US-ASCII");
	}
}
