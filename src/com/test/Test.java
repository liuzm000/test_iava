package com.test;

import java.util.LinkedList;
import java.util.Random;

public class Test {

	int m_get_n_total = 0;

	public int get_m_get_n_total() {
		return m_get_n_total;
	}

	// m_get_n(chs, 0, 0, n, ""); M 里取 N
	public void m_get_n(String[] chs, int index, int count, int n, String result) {
		if (count == n) {
			System.out.println(result + ",");
			m_get_n_total++;
			return;
		}
		for (int i = index; i < chs.length; ++i) {
			m_get_n(chs, i + 1, count + 1, n, result + chs[i]);
		}
	}

	// m_get_n(chs, 0, 0, n, ""); M 里取 N
	public void m_get_n(String[] chs, int index, int count, int n,
			LinkedList<String> result) {
		if (count == n) {
			m_get_n_total++;
			return;
		}

		for (int i = index; i < chs.length; ++i) {
			result.addLast(chs[i]);
			m_get_n(chs, i + 1, count + 1, n, result);
			result.removeLast();
		}
	}

	public static void main(String[] args) throws InterruptedException {
//		String[] chs = { "1", "2", "3", "4", "5", "6" };
//		int n = 3;
//		Test test = new Test();
//		test.m_get_n(chs, 0, 0, n, "");
//		System.out.println(test.get_m_get_n_total());
		
		Random random = new Random();
		int ran = random.nextInt(10);
		System.out.println(ran);
	}

}
