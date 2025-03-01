const calcStatsFromAPI = require('./calcStatsFromAPI');

jest.mock('./loadData', () => jest.fn());

test('Проверяет, что функция loadData вызвана 1 раз', async () => {
    const mockData = [
        {
            breed: 'Turkish Van',
            country: 'United Kingdom',
            origin: 'Natural',
            coat: 'Semi-long',
            pattern: 'Van'
        },
        {
            breed: 'York Chocolate',
            country: 'United States',
            origin: 'Natural',
            coat: 'Long',
            pattern: 'Solid'
        }
    ];

    const loadDataModule = require('./loadData');
    loadDataModule.mockResolvedValue(mockData);

    await calcStatsFromAPI();

    expect(loadDataModule).toHaveBeenCalledTimes(1);
});

test('Проверяет, что результат calcStatsFromAPI соответствует ожидаемому', async () => {
    const mockData = [
        {
            breed: 'Turkish Van',
            country: 'United Kingdom',
            origin: 'Natural',
            coat: 'Semi-long',
            pattern: 'Van'
        },
        {
            breed: 'York Chocolate',
            country: 'United States',
            origin: 'Natural',
            coat: 'Long',
            pattern: 'Solid'
        }
    ];

    const loadData = require('./loadData');
    loadData.mockResolvedValue(mockData);

    const result = await calcStatsFromAPI();

    expect(result).toEqual({
        'United Kingdom': 1,
        'United States': 1
    });
});