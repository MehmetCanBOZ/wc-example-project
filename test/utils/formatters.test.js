import { expect } from '@open-wc/testing';
import {
  formatDate,
  positions,
  getTranslatedDepartment,
  getTranslatedPosition,
  paginate,
} from '../../src/utils/formatters.js';

describe('Formatters Utils', () => {
  let mockLocalizationManager;

  beforeEach(() => {
    mockLocalizationManager = {
      t: key => {
        const translations = {
          analytics: 'Analytics',
          tech: 'Tech',
          junior: 'Junior',
          medior: 'Medior',
          senior: 'Senior',
        };
        return translations[key] || key;
      },
    };
  });

  describe('formatDate', () => {
    it('should format date strings correctly', () => {
      const result = formatDate('2023-01-15');

      expect(result).to.equal('15/01/2023');
    });
  });

  describe('constants', () => {
    it('should have correct position values', () => {
      expect(positions).to.deep.equal(['Junior', 'Medior', 'Senior']);
    });
  });

  describe('getTranslatedDepartment', () => {
    it('should translate department names', () => {
      const result = getTranslatedDepartment(
        'Analytics',
        mockLocalizationManager,
      );

      expect(result).to.equal('Analytics');
    });

    it('should translate to Turkish', () => {
      const turkishManager = {
        t: key => {
          const translations = {
            analytics: 'Analitik',
            tech: 'Teknoloji',
          };
          return translations[key] || key;
        },
      };

      const result = getTranslatedDepartment('Analytics', turkishManager);

      expect(result).to.equal('Analitik');
    });
  });

  describe('getTranslatedPosition', () => {
    it('should translate position names', () => {
      const result = getTranslatedPosition('Senior', mockLocalizationManager);

      expect(result).to.equal('Senior');
    });
  });

  describe('paginate', () => {
    const testItems = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));

    it('should paginate items correctly', () => {
      const result = paginate(testItems, 1, 10);

      expect(result.items).to.have.length(10);
      expect(result.items[0].id).to.equal(1);
      expect(result.items[9].id).to.equal(10);
      expect(result.currentPage).to.equal(1);
      expect(result.totalPages).to.equal(3);
      expect(result.totalItems).to.equal(25);
      expect(result.hasNext).to.be.true;
      expect(result.hasPrev).to.be.false;
    });

    it('should handle middle pages', () => {
      const result = paginate(testItems, 2, 10);

      expect(result.items).to.have.length(10);
      expect(result.items[0].id).to.equal(11);
      expect(result.items[9].id).to.equal(20);
      expect(result.currentPage).to.equal(2);
      expect(result.hasNext).to.be.true;
      expect(result.hasPrev).to.be.true;
    });

    it('should handle last page', () => {
      const result = paginate(testItems, 3, 10);

      expect(result.items).to.have.length(5);
      expect(result.items[0].id).to.equal(21);
      expect(result.items[4].id).to.equal(25);
      expect(result.currentPage).to.equal(3);
      expect(result.hasNext).to.be.false;
      expect(result.hasPrev).to.be.true;
    });

    it('should handle single page', () => {
      const smallItems = testItems.slice(0, 5);
      const result = paginate(smallItems, 1, 10);

      expect(result.items).to.have.length(5);
      expect(result.totalPages).to.equal(1);
      expect(result.hasNext).to.be.false;
      expect(result.hasPrev).to.be.false;
    });

    it('should handle empty array', () => {
      const result = paginate([], 1, 10);

      expect(result.items).to.have.length(0);
      expect(result.totalPages).to.equal(0);
      expect(result.totalItems).to.equal(0);
      expect(result.hasNext).to.be.false;
      expect(result.hasPrev).to.be.false;
    });

    it('should handle page size larger than total items', () => {
      const result = paginate(testItems, 1, 50);

      expect(result.items).to.have.length(25);
      expect(result.totalPages).to.equal(1);
      expect(result.hasNext).to.be.false;
      expect(result.hasPrev).to.be.false;
    });

    it('should handle page beyond total pages', () => {
      const result = paginate(testItems, 10, 10);

      expect(result.items).to.have.length(0);
      expect(result.currentPage).to.equal(10);
      expect(result.totalPages).to.equal(3);
      expect(result.hasNext).to.be.false;
      expect(result.hasPrev).to.be.true;
    });

    it('should calculate total pages correctly', () => {
      expect(paginate(testItems, 1, 10).totalPages).to.equal(3);
      expect(paginate(testItems, 1, 5).totalPages).to.equal(5);
      expect(paginate(testItems, 1, 25).totalPages).to.equal(1);
      expect(paginate(testItems, 1, 1).totalPages).to.equal(25);
    });

    it('should handle different page sizes', () => {
      const result5 = paginate(testItems, 1, 5);
      expect(result5.items).to.have.length(5);
      expect(result5.totalPages).to.equal(5);

      const result20 = paginate(testItems, 1, 20);
      expect(result20.items).to.have.length(20);
      expect(result20.totalPages).to.equal(2);
    });
  });
});
